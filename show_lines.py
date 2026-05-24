import re
import json

with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()

# Find first game: 'Play acey-ducey'
start_idx = 0
for i, l in enumerate(lines):
    if 'Play  acey-ducey' in l:
        start_idx = i
        break

# Show lines 47-200 to understand the structure
print('Lines 47-200:')
for j in range(47, min(200, len(lines))):
    l = lines[j]
    if l:
        print(str(j) + ': ' + l[:80])
    else:
        print(str(j) + ': <empty>')