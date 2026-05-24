
import re

def parse_contents(text):
    # Find the contents section
    # Look for the form feed followed by Contents
    contents_match = re.search(r'\x0c\s*Contents\s*\n', text)
    if not contents_match:
        # Try without the form feed
        contents_match = re.search(r'Contents\s*\n', text)
        if not contents_match:
            return []
    
    start_pos = contents_match.end()
    # Get the rest of the text after Contents header
    remaining_text = text[start_pos:]
    # Split into lines
    lines = remaining_text.split('\n')
    
    # Skip header lines (Brief Description, Page)
    game_lines = []
    in_games = False
    for line in lines:
        stripped = line.strip()
        if stripped == 'Brief Description':
            in_games = True
            continue
        elif stripped == 'Page':
            continue
        elif in_games:
            # Stop when we hit another form feed or a section that looks like all caps
            if line.startswith('\x0c') or (stripped.isupper() and len(stripped) > 2 and not any(c.isdigit() for c in stripped)):
                break
            if stripped:  # Not empty
                game_lines.append(stripped)
    
    # Now parse the game lines: they come in pairs (title, page)
    games = []
    i = 0
    while i < len(game_lines):
        title = game_lines[i]
        
        # Special case: if the title ends with a number, it might be the page number
        # Check if the last word is a number
        words = title.split()
        if words and words[-1].isdigit():
            # The last word is a number, treat it as the page number
            page = int(words[-1])
            # Remove the page number from the title
            title = ' '.join(words[:-1]).strip()
            games.append({'title': title, 'page': page})
            i += 1
        elif i + 1 < len(game_lines) and game_lines[i+1].isdigit():
            # Next line is the page number
            page = int(game_lines[i+1])
            games.append({'title': title, 'page': page})
            i += 2
        else:
            # Skip this line, don't know what it is
            i += 1
    return games

if __name__ == '__main__':
    with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    games = parse_contents(text)
    print('Found {} games:'.format(len(games)))
    for game in games:  # Show all games
        print('{}: {}'.format(game['title'], game['page']))

