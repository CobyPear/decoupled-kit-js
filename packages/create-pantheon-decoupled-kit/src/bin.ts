#!/usr/bin/env node
import { parseArgs, main } from './index.old';
import { decoupledKitGenerators } from './generators';

await main(parseArgs(), decoupledKitGenerators);
