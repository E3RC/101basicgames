
def parse_games_simple(text):
    lines = text.splitlines()
    games = []
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        
        # Skip empty lines and headers
        if not line.strip() or line.strip() in ['Brief Description', 'Page', 'Contents']:
            i += 1
            continue
        
        # Stop if we hit another form feed or all-caps section header
        if line.startswith('') or (line.strip().isupper() and len(line.strip()) > 2):
            break
        
        # This should be a game title
        title = line.rstrip()
        i += 1
        
        # Look for page number in next non-empty line
        while i < len(lines) and not lines[i].strip():
            i += 1
        
        if i < len(lines):
            page_line = lines[i].rstrip()
            # Try to extract just the first number from the line
            import re
            match = re.search(r'\\b(\\d+)\\b', page_line)
            if match:
                page = int(match.group(1))
                games.append({'title': title, 'page': page})
                i += 1
            else:
                # No number found, skip this title
                pass
        else:
            break
    
    return games
    
# Test with a small sample
sample_text = '''Contents

Brief Description

Page

Play  acey-ducey  with  the  computer 
13
15
Computer  constructs 'a  maze  
Computer  guesses  animals  and  learns  new  ones  from  you  17 
19
Ancient  game  of  rotating  beans  in  pits 
22
Guess  a  mystery  3-digit  number  by  logic 
24
'''

games = parse_games_simple(sample_text)
print('Found {} games in sample:'.format(len(games)))
for game in games:
    print('{}: {}'.format(game['title'], game['page']))
