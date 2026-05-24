import re

def extract_games(text):
    lines = text.splitlines()
    games = []
    i = 0
    # Find the contents section
    while i < len(lines):
        if 'Contents' in lines[i]:
            break
        i += 1
    if i >= len(lines):
        return games
    i += 1  # Skip the Contents line
    # Skip to Brief Description
    while i < len(lines) and lines[i].strip() != 'Brief Description':
        i += 1
    if i < len(lines) and lines[i].strip() == 'Brief Description':
        i += 1
    # Skip to Page
    while i < len(lines) and lines[i].strip() != 'Page':
        i += 1
    if i < len(lines) and lines[i].strip() == 'Page':
        i += 1
    # Now parse games
    while i < len(lines):
        line = lines[i].rstrip()
        # Stop conditions
        if not line.strip():
            i += 1
            continue
        if line.startswith(''):
            break
        # If the line is all caps and looks like a section header, stop
        stripped = line.strip()
        if stripped.isupper() and len(stripped) > 2 and not any(c.isdigit() for c in stripped):
            break
        # Now we have a title line
        title = line
        # Check if the title ends with a number
        match = re.search(r'(\d+)\s*$', title)
        if match:
            # The number at the end is the page number
            page = int(match.group(1))
            # Remove the number from the title
            title = title[:match.start()].rstrip()
            games.append({'title': title.strip(), 'page': page})
            i += 1
        else:
            # The page number might be on the next line
            i += 1
            # Skip empty lines
            while i < len(lines) and not lines[i].strip():
                i += 1
            if i < len(lines):
                page_line = lines[i].rstrip()
                # Try to extract a number from the page line
                match = re.search(r'(\d+)', page_line)
                if match:
                    page = int(match.group(1))
                    games.append({'title': title.strip(), 'page': page})
                    i += 1
                else:
                    # No number found, skip this title
                    pass
            else:
                break
    return games

if __name__ == '__main__':
    with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    games = extract_games(text)
    print('Found {} games:'.format(len(games)))
    for game in games[:20]:
        print('{}: {}'.format(game['title'], game['page']))
    if len(games) > 20:
        print('... and {} more'.format(len(games) - 20))
    # Save to JSON
    import json
    with open('data/games.json', 'w') as f:
        json.dump(games, f, indent=2)
    # Save to CSV
    import csv
    with open('data/games.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['title', 'page'])
        writer.writeheader()
        writer.writerows(games)