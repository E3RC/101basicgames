with open('source/extracted/fulltext.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

non_empty = [line.strip() for line in lines if line.strip()]

# Find the index of the line that contains 'Contents'
contents_idx = -1
for i, line in enumerate(non_empty):
    if 'Contents' in line:
        contents_idx = i
        break

if contents_idx == -1:
    print("Contents not found")
    exit(0)

# The next two non-empty lines should be 'Brief Description' and 'Page'
# So we start at contents_idx + 3
i = contents_idx + 3
games = []
while i < len(non_empty):
    title = non_empty[i]
    i += 1
    if i >= len(non_empty):
        break
    page_str = non_empty[i]
    i += 1
    # Try to convert page_str to an integer
    try:
        page = int(page_str)
        games.append({'title': title, 'page': page})
    except ValueError:
        # If conversion fails, try to extract a number from the string
        import re
        match = re.search(r'(\d+)', page_str)
        if match:
            page = int(match.group(1))
            games.append({'title': title, 'page': page})
        else:
            # If still no number, skip this pair
            pass

print(f"Found {len(games)} games")
for game in games[:10]:
    print(f"{game['title']}: {game['page']}")