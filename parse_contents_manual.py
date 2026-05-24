import re

def parse_contents_manual(text):
    # Manually parse based on what we see in the debug output
    lines = text.split(chr(10))  # Split by newline
    
    # Find the contents section
    start_i = -1
    for i, line in enumerate(lines):
        if 'Contents' in line:
            start_i = i
            break
    
    if start_i == -1:
        return []
    
    # Skip to after the header
    i = start_i + 1  # Contents line
    while i < len(lines) and lines[i].strip() not in ['Brief Description', '']:
        i += 1
    if i < len(lines) and lines[i].strip() == 'Brief Description':
        i += 1  # Skip Brief Description
    while i < len(lines) and lines[i].strip() == '':
        i += 1  # Skip empty lines
    if i < len(lines) and lines[i].strip() == 'Page':
        i += 1  # Skip Page
    while i < len(lines) and lines[i].strip() == '':
        i += 1  # Skip empty lines
    
    # Now parse games
    games = []
    while i < len(lines):
        line = lines[i].rstrip()  # Remove trailing whitespace/newlines
        stripped = line.strip()
        
        # Stop conditions
        if not stripped or line.startswith('') or (stripped.isupper() and len(stripped) > 2):
            break
            
        # Check if line ends with a number (page number)
        match = re.search(r'(\d+)\s*$', line)
        if match:
            # Page number is at the end of this line
            page = int(match.group(1))
            title = line[:match.start()].rstrip()  # Remove trailing spaces
            games.append({'title': title, 'page': page})
            i += 1
        else:
            # Maybe the page number is on the next line
            if i + 1 < len(lines):
                next_line = lines[i+1].rstrip()
                next_stripped = next_line.strip()
                if next_stripped.isdigit():
                    page = int(next_stripped)
                    games.append({'title': stripped, 'page': page})
                    i += 2
                else:
                    # Not a page number, skip this line
                    i += 1
            else:
                i += 1
    
    return games

if __name__ == '__main__':
    with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    games = parse_contents_manual(text)
    print('Found {} games:'.format(len(games)))
    for game in games:
        print('{}: {}'.format(game['title'], game['page']))