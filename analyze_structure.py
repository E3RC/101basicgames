import re
import json

with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()

# Show a wider range to understand the structure
games = []

# Parse from line 47 onwards, looking for title-page pairs
i = 47
last_page = 0
while i < len(lines):
    l = lines[i].strip()
    if not l:
        i += 1
        continue
    if l.startswith('\x0c'):
        i += 1
        continue
    # Stop when we hit an all-caps line that looks like a program name
    if l.isupper() and ' ' not in l and len(l) <= 10 and not any(c.isdigit() for c in l):
        break
    
    # Check if this is a page number
    if l.isdigit():
        # This is a page number for the previous title
        if games and 'page' not in games[-1]:
            games[-1]['page'] = int(l)
        last_page = int(l)
        i += 1
        continue
    
    # Check if line ends with a page number
    match = re.search(r'\s+(\d+)\s*$', l)
    if match:
        page = int(match.group(1))
        title = l[:match.start()].strip()
        games.append({'title': title, 'page': page})
        last_page = page
        i += 1
    else:
        # Look ahead for page number
        j = i + 1
        while j < len(lines) and j < i + 5:
            next_l = lines[j].strip()
            if not next_l:
                j += 1
                continue
            if next_l.isdigit():
                games.append({'title': l, 'page': int(next_l)})
                i = j + 1
                last_page = int(next_l)
                break
            j += 1
        else:
            i += 1

print('Found', len(games), 'games')
print('Last 30 games:')
for g in games[-30:]:
    print(g['title'] + ': ' + str(g.get('page', 'no page')))

# Get unique games
unique_games = []
seen = set()
for g in games:
    key = g['title'].lower().strip()
    if key in seen:
        continue
    seen.add(key)
    unique_games.append(g)

print()
print('Unique games:', len(unique_games))
for g in unique_games:
    print(g['title'] + ': ' + str(g.get('page', 'no page')))