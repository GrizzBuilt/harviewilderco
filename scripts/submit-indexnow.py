#!/usr/bin/env python3
"""Manually notify IndexNow after a successful public-site deployment."""
import json
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

root = Path(__file__).resolve().parent.parent
payload = json.loads((root / 'indexnow.json').read_text())
assert payload['host'] == 'harviewilderco.com'
assert payload['urlList'] == ['https://harviewilderco.com/']
assert urlparse(payload['keyLocation']).hostname == payload['host']
with urlopen(payload['keyLocation'], timeout=30) as response:
    assert response.status == 200
    assert response.read().decode().strip() == payload['key'], 'Live verification key differs'
request = Request('https://api.indexnow.org/indexnow', data=json.dumps(payload).encode(),
                  headers={'Content-Type': 'application/json; charset=utf-8'}, method='POST')
with urlopen(request, timeout=60) as response:
    status = response.status
    body = response.read().decode()
    if status not in (200, 202):
        raise RuntimeError(f'IndexNow returned HTTP {status}: {body}')
    print(json.dumps({'status': status, 'submitted_urls': payload['urlList'],
                      'key_validation_pending': status == 202, 'response': body}))
