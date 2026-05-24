import re
import json

with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()

games = []

# Process lines 47-135 to capture all games
# Strategy: look for title patterns and page numbers

i = 47
current_title = ''

while i < 135:
    l = lines[i].strip()
    
    if not l:
        i += 1
        continue
    
    # Check if this is a page number
    if l.isdigit():
        page = int(l)
        if current_title:
            # Merge with previous title
            games.append({'title': current_title.strip(), 'page': page})
            current_title = ''
        i += 1
        continue
    
    # Check if line ends with a page number
    match = re.search(r'\s+(\d+)\s*$', l)
    if match:
        page = int(match.group(1))
        title = l[:match.start()].strip()
        games.append({'title': title, 'page': page})
        i += 1
        continue
    
    # This is a title line - accumulate it
    # Check if next line is also a title (no page number found)
    j = i + 1
    while j < 135 and not lines[j].strip():
        j += 1
    
    if j < 135:
        next_l = lines[j].strip()
        if next_l.isdigit():
            # Current line is a title, next is page number
            games.append({'title': l, 'page': int(next_l)})
            i = j + 1
        else:
            # Could be multi-line title - accumulate
            current_title = l
            i += 1
    else:
        current_title = l
        i += 1

print('Found', len(games), 'raw games')
for g in games:
    print(g['title'] + ': ' + str(g['page']))

# Get unique
unique = []
seen = set()
for g in games:
    key = g['title'].lower().strip()
    if key not in seen:
        seen.add(key)
        unique.append(g)

print()
print('Unique games:', len(unique))