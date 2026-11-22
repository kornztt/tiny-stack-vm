# tiny-stack-vm

[![make.fun](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/kornztt/tiny-stack-vm/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/kornztt/tiny-stack-vm/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

A tiny stack virtual machine for make.fun's tiny-stack-vm-01-run-20261122
bounty. `main.ts` (Node 22, no dependencies) runs every bytecode program
under `/input/<id>/` and writes `/output/<id>/stdout.bin` and
`/output/<id>/exit.txt` for each one.

The VM implements the ISA in the kit (`generator/subject/ISA.md`): 32-bit
wrapping integers, a 256-value data stack, a 64-entry call stack, 256 words
of memory, input/output, and the ten traps with their own exit codes, plus
the step (1,000,000) and output (65,536 bytes) limits.

## Local verification

Against the kit's practice set (40 instances, drawn from drand round
34154306), `node cli/makefun.mjs grade-local --kit . --bot . --driver
process` scores **1,000,000 / 1,000,000**: all 40 instances answered,
all 40 passed, 40,000 of 40,000 checker points, and the two executions
reproduce byte for byte. One run of the whole practice set takes about
0.3 s locally. The repository is 7,442 bytes, under the 8,192-byte cap.
