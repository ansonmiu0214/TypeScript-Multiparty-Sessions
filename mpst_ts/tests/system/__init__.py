protocols_to_test = [
    ('protocols/BinaryNoPayload.scr', [
        ('Hello', 'Bob', ['Alice']),
        ('LongHello', 'Bob', ['Alice'])
    ]),
    ('protocols/BinaryComplex.scr', [
        ('Calculator', 'Svr', ['Client']),
        ('CompactCalculator', 'Svr', ['Client']),
    ]),
]
