import re

def parse_contents_fixed(text):
    lines = text.splitlines()
    
    # Find the contents section
    start_idx = -1
    for i, line in enumerate(lines):
        if 'Contents' in line:
            start_idx = i
            break
    
    if start_idx == -1:
        return []
    
    # Skip header lines
    i = start_idx + 1
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
    
    # Now parse game entries
    games = []
    while i < len(lines):
        line = lines[i].rstrip()
        
        # Stop conditions
        if not line or line.startswith(''):
            break
        if line.strip().isupper() and len(line.strip()) > 2 and not any(c.isdigit() for c in line.strip()):
            break
            
        # This should be a game title line
        title = line.rstrip()  # Remove trailing spaces
        i += 1
        
        # Skip empty lines to get to page number
        while i < len(lines) and not lines[i].strip():
            i += 1
            
        # Get page number
        if i < len(lines):
            page_line = lines[i].rstrip()
            if page_line.isdigit():
                page = int(page_line)
                games.append({'title': title, 'page': page})
                i += 1
            else:
                # Try to extract number from the line
                match = re.search(r'(\d+)', page_line)
                if match:
                    page = int(match.group(1))
                    games.append({'title': title, 'page': page})
                    i += 1
                else:
                    # Not a page number, skip this title
                    pass
        else:
            break
    
    return games

if __name__ == '__main__':
    with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    games = parse_contents_fixed(text)
    print('Found {} games:'.format(len(games)))
    for game in games:
        print('{}: {}'.format(game['title'], game['page']))
