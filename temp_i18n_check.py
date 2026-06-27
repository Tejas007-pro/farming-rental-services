import re
import json
import glob
import os

keys = set()
for path in glob.glob('src/**/*.*', recursive=True):
    if path.endswith(('.js', '.jsx', '.ts', '.tsx')):
        text = open(path, encoding='utf-8').read()
        keys.update(m.group(1) for m in re.finditer(r"\bt\(\s*[\"\']([^\"\']+)[\"\']", text))
        keys.update(m.group(1) for m in re.finditer(r"\bt\(\s*`([^`]+)`", text))


def load_json(fn):
    try:
        return json.load(open(fn, encoding='utf-8'))
    except Exception as e:
        print('ERR', fn, e)
        return {}


en = load_json('src/locales/en.json')
mr = load_json('src/locales/mr.json')


def flatten(d, prefix=''):
    out = {}
    for k, v in d.items():
        key = k if not prefix else prefix + '.' + k
        if isinstance(v, dict):
            out.update(flatten(v, key))
        else:
            out[key] = v
    return out


enf = flatten(en)
mrf = flatten(mr)

miss_en = sorted(k for k in keys if k not in enf)
miss_mr = sorted(k for k in keys if k not in mrf)
print('total_keys', len(keys))
print('en_keys', len(enf))
print('mr_keys', len(mrf))
print('missing_en', len(miss_en))
print('missing_mr', len(miss_mr))
print('---EN---')
print('\n'.join(miss_en))
print('---MR---')
print('\n'.join(miss_mr))
