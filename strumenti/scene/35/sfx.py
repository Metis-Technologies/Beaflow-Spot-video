def build_sfx():                      # un effetto per ogni evento visivo (index.html)
    s = np.zeros(int(DUR * SR))
    put(s, whoosh(0.5), 0.1, 0.05)
    for k in range(3): put(s, buzz(), 0.6 + k * 0.5, 0.05)                         # giorni vuoti
    put(s, riser(0.45), 2.05, 0.1); put(s, impact(), 2.5, 0.26); put(s, whoosh(0.6), 2.3, 0.08)   # arriva il buono
    put(s, shimmer(1568), 2.8, 0.07)
    put(s, impact(), 5.0, 0.1); put(s, click(), 5.5, 0.22); put(s, click(), 6.4, 0.22)  # tocchi
    put(s, shimmer(1760), 5.55, 0.05); put(s, shimmer(1976), 6.45, 0.05)
    put(s, whoosh(0.7), 7.3, 0.08); put(s, impact(), 7.5, 0.12)
    for k in range(8): put(s, whoosh(0.35), 7.6 + k * 0.12, 0.03)                  # aeroplanini
    for k in range(8): put(s, pop(660 * 2 ** (k / 12)), 8.6 + k * 0.12, 0.09)      # case che si accendono
    put(s, whoosh(0.6), 9.7, 0.07); put(s, impact(), 10.0, 0.12)
    for i in range(12): put(s, tick(1100 + 60 * i), 10.3 + i * 0.07, 0.04)        # agenda piena
    put(s, ding(1046.5), 11.2, 0.15)
    put(s, riser(0.7), 12.15, 0.12); put(s, impact(), 12.85, 0.34); put(s, shimmer(1318.5), 12.9, 0.1)
    put(s, click(), 14.18, 0.2)
    return s
