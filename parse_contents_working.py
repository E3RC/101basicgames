
def parse_contents_from_lines(lines):
    # Find the contents section
    start_idx = -1
    for i, line in enumerate(lines):
        if 'Contents' in line:
            start_idx = i
            break

    if start_idx == -1:
        return []

    # Skip header lines: Contents, empty line, Brief Description, empty line, Page, empty line
    i = start_idx + 1  # Contents line
    while i < len(lines) and lines[i].strip() not in ['Brief Description', '']:
        i += 1
    if i < len(lines) and lines[i].strip() == 'Brief Description':
        i += 1  # Skip Brief Description
    while i < len(lines) and lines[i].strip() == '':
        i += 1  # Skip empty line
    if i < len(lines) and lines[i].strip() == 'Page':
        i += 1  # Skip Page
    while i < len(lines) and lines[i].strip() == '':
        i += 1  # Skip empty line

    # Now parse game entries: title, page, title, page, ...
    games = []
    while i < len(lines):
        # Get title line
        title_line = lines[i].rstrip()
        i += 1

        # Skip empty lines
        while i < len(lines) and not lines[i].strip():
            i += 1

        # Get page line
        if i < len(lines):
            page_line = lines[i].rstrip()
            i += 1

            # Skip empty lines after page number
            while i < len(lines) and not lines[i].strip():
                i += 1

            # Check if we've hit another section (form feed or all-caps header)
            if i < len(lines):
                next_line = lines[i]
                if next_line.startswith('') or (next_line.strip().isupper() and len(next_line.strip()) > 2 and not any(c.isdigit() for c in next_line.strip())):
                    break

            # Extract page number
            try:
                page = int(page_line.strip())
                games.append({'title': title_line.strip(), 'page': page})
            except ValueError:
                # If page_line is not a number, try to extract number from it
                import re
                match = re.search(r'(\d+)', page_line)
                if match:
                    page = int(match.group(1))
                    games.append({'title': title_line.strip(), 'page': page})
                # Otherwise skip this entry
        else:
            break
    
    return games

if __name__ == '__main__':
    with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    lines = text.splitlines()
    games = parse_contents_from_lines(lines)
    print('Found {} games:'.format(len(games)))
    for game in games:
        print('{}: {}'.format(game['title'], game['page']))
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
