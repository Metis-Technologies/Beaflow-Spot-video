def build_sfx():                      # un effetto per ogni evento visivo (index.html)
    s = np.zeros(int(DUR * SR))
    put(s, whoosh(1.2), 0.2, 0.06)                                                  # i clienti se ne vanno
    for i in range(5): put(s, tick(1500 - 80 * i), 0.6 + i * 0.3, 0.03)
    put(s, riser(0.45), 2.05, 0.1); put(s, impact(), 2.5, 0.26); put(s, whoosh(0.6), 2.3, 0.08)   # arriva la carta
    put(s, shimmer(1568), 2.8, 0.06)
    put(s, impact(), 5.0, 0.1)
    for k in range(7): put(s, add(pop(700 * 2 ** (k / 12)), 0.4 * tick(2600)), 5.2 + k * 0.3, 0.12)   # timbri
    put(s, whoosh(0.7), 7.3, 0.08); put(s, impact(), 7.5, 0.12); put(s, ding(1046.5), 7.62, 0.12)
    put(s, big_pop(), 9.2, 0.14); put(s, shimmer(1760), 9.3, 0.08)                 # il regalo si apre
    put(s, whoosh(0.6), 9.7, 0.07); put(s, impact(), 10.0, 0.12)
    put(s, whoosh(1.4), 10.2, 0.05); put(s, pop(880), 10.5, 0.12)                  # ritorno
    put(s, riser(0.7), 12.15, 0.12); put(s, impact(), 12.85, 0.34); put(s, shimmer(1318.5), 12.9, 0.1)
    put(s, click(), 14.18, 0.2)
    return s
