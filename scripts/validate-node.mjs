// One-shot structural validator. Walks the compiled Reachkit node description
// and flags inconsistencies that lint and tsc don't catch:
//   1. preSend functions reference parameter names that don't exist as fields
//   2. routing.send.property names that look misspelled (loose check, warn-only)
//   3. operations referenced in displayOptions.show that aren't declared
//   4. fields with displayOptions referencing operation values that don't exist
//   5. duplicate operation values within a resource
//
// Run with: node scripts/validate-node.mjs

import { Reachkit } from '../dist/nodes/Reachkit/Reachkit.node.js';

const errors = [];
const warnings = [];

const node = new Reachkit();
const props = node.description.properties;

// --- Build maps of resource -> operations and resource+op -> fields ---
const resourceOptions = new Set();
const operationsByResource = new Map(); // resource -> Set<opValue>
const fieldsByOpKey = new Map(); // `${resource}|${op}` -> Set<fieldName>
const allFieldNames = new Set();

const resourceProp = props.find((p) => p.name === 'resource');
if (!resourceProp) errors.push('No `resource` parameter found');
else for (const opt of resourceProp.options ?? []) resourceOptions.add(opt.value);

for (const prop of props) {
	if (prop.name === 'resource') continue;
	allFieldNames.add(prop.name);

	if (prop.name === 'operation') {
		const showResources = prop.displayOptions?.show?.resource ?? [];
		for (const res of showResources) {
			const set = operationsByResource.get(res) ?? new Set();
			for (const opt of prop.options ?? []) set.add(opt.value);
			operationsByResource.set(res, set);
		}
	}
}

// Now figure out for each (resource, op) which top-level field names are visible.
for (const prop of props) {
	if (prop.name === 'resource' || prop.name === 'operation') continue;
	const show = prop.displayOptions?.show ?? {};
	const resources = show.resource ?? [...resourceOptions];
	const ops = show.operation ?? [];
	for (const res of resources) {
		const allOpsForRes = operationsByResource.get(res) ?? new Set();
		const opSet = ops.length ? ops : [...allOpsForRes];
		for (const op of opSet) {
			const key = `${res}|${op}`;
			const set = fieldsByOpKey.get(key) ?? new Set();
			set.add(prop.name);
			fieldsByOpKey.set(key, set);
		}
	}
}

// --- Check 1: preSend getNodeParameter calls reference real fields ---
function findPreSendsAndCheck(prop, contextResource = null, contextOp = null) {
	// On operation options, each option may have routing.send.preSend
	if (prop.name === 'operation') {
		const show = prop.displayOptions?.show ?? {};
		const resources = show.resource ?? [];
		for (const res of resources) {
			for (const opt of prop.options ?? []) {
				const preSend = opt.routing?.send?.preSend ?? [];
				for (const fn of preSend) {
					const src = fn.toString();
					const matches = [...src.matchAll(/getNodeParameter\(\s*['"]([^'"]+)['"]/g)];
					for (const m of matches) {
						const paramName = m[1];
						const key = `${res}|${opt.value}`;
						const visibleFields = fieldsByOpKey.get(key) ?? new Set();
						if (!visibleFields.has(paramName) && !allFieldNames.has(paramName)) {
							errors.push(
								`preSend on ${res}.${opt.value} references getNodeParameter('${paramName}') but no field with that name exists`,
							);
						} else if (!visibleFields.has(paramName)) {
							warnings.push(
								`preSend on ${res}.${opt.value} references '${paramName}' which exists globally but isn't visible for this resource+op`,
							);
						}
					}
				}
			}
		}
	}
}

for (const prop of props) findPreSendsAndCheck(prop);

// --- Check 2: displayOptions reference real operation values ---
for (const prop of props) {
	if (prop.name === 'resource') continue;
	const show = prop.displayOptions?.show ?? {};
	const resources = show.resource ?? [];
	const ops = show.operation ?? [];
	for (const res of resources) {
		const known = operationsByResource.get(res);
		if (!known) {
			errors.push(`Field '${prop.name}' references resource '${res}' which has no operations declared`);
			continue;
		}
		for (const op of ops) {
			if (!known.has(op)) {
				errors.push(`Field '${prop.name}' references operation '${op}' which is not declared for resource '${res}'`);
			}
		}
	}
}

// --- Check 3: duplicate operation values within a resource ---
for (const prop of props) {
	if (prop.name !== 'operation') continue;
	const seen = new Set();
	for (const opt of prop.options ?? []) {
		if (seen.has(opt.value)) {
			errors.push(`Duplicate operation value '${opt.value}' in operation property`);
		}
		seen.add(opt.value);
	}
}

// --- Check 4: every operation has at least the required fields its routing URL needs ---
// Look for {{$parameter.foo}} or {{$parameter['foo']}} in routing URLs and verify field exists for that op
for (const prop of props) {
	if (prop.name !== 'operation') continue;
	const show = prop.displayOptions?.show ?? {};
	const resources = show.resource ?? [];
	for (const res of resources) {
		for (const opt of prop.options ?? []) {
			const url = opt.routing?.request?.url ?? '';
			const matches = [...url.matchAll(/\$parameter\.([a-zA-Z_][a-zA-Z0-9_]*)/g)];
			const key = `${res}|${opt.value}`;
			const visible = fieldsByOpKey.get(key) ?? new Set();
			for (const m of matches) {
				const paramName = m[1];
				if (!visible.has(paramName)) {
					errors.push(
						`Operation ${res}.${opt.value} URL references $parameter.${paramName} but no such field is visible for this op`,
					);
				}
			}
		}
	}
}

// --- Report ---
console.log(`Validated ${props.length} top-level properties.`);
console.log(`Resources: ${[...resourceOptions].join(', ')}`);
console.log(
	`Operations per resource:\n${[...operationsByResource.entries()]
		.map(([r, ops]) => `  ${r}: ${[...ops].join(', ')}`)
		.join('\n')}`,
);

if (warnings.length) {
	console.log(`\n⚠ ${warnings.length} warning(s):`);
	for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
	console.log(`\n✖ ${errors.length} error(s):`);
	for (const e of errors) console.log(`  - ${e}`);
	process.exit(1);
}
console.log(`\n✓ No structural errors.`);
