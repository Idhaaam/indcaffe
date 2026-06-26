import os
import re

def refactor_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '@Autowired' not in content:
        return

    # Add lombok if not present
    if 'lombok.RequiredArgsConstructor' not in content:
        content = re.sub(r'(import .*;\n)(?!import)', r'\1import lombok.RequiredArgsConstructor;\n', content, count=1)

    # Add @RequiredArgsConstructor to class if not present
    if '@RequiredArgsConstructor' not in content:
        # Find the class declaration and add @RequiredArgsConstructor above it
        content = re.sub(r'((?:@\w+(?:\(.*\))?\s*)*)(public class)', r'\1@RequiredArgsConstructor\n\2', content)

    # Remove @Autowired and make field final
    # Matches: @Autowired\n private SomeType someName; OR @Autowired private SomeType someName;
    # Will convert to: private final SomeType someName;
    
    # 1. @Autowired on same line
    content = re.sub(r'@Autowired\s+(private\s+[^\s]+\s+[^\s;]+;)', r'private final \1', content)
    # Fix if the first group captured 'private' already
    content = re.sub(r'private final private', r'private final', content)
    
    # 2. @Autowired on previous line
    content = re.sub(r'@Autowired\s*\n\s*private', r'private final', content)

    # 3. For package-private without 'private' keyword (like in MasterDataService.java)
    # @Autowired CategoryRepository categoryRepository; -> private final CategoryRepository categoryRepository;
    content = re.sub(r'@Autowired\s+([A-Z][a-zA-Z0-9<>]*\s+[a-zA-Z0-9]+;)', r'private final \1', content)
    
    # 4. Remove any stray @Autowired just in case
    content = content.replace('@Autowired\n', '')
    content = content.replace('@Autowired', '')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Refactored: {filepath}")

for root, dirs, files in os.walk('src/main/java'):
    for file in files:
        if file.endswith('.java'):
            refactor_file(os.path.join(root, file))
