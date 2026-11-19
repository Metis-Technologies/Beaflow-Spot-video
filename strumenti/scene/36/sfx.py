def build_sfx():                      # un effetto per ogni evento visivo (index.html)
    s = np.zeros(int(DUR * SR))
    put(s, whoosh(0.8), 0.1, 0.05)
    for i in range(6): put(s, tick(1300 + 70 * (i % 3)), 0.4 + i * 0.25, 0.03)    # la folla
    put(s, pop(523.25), 0.55, 0.12)                                                # il punto di domanda
    put(s, riser(0.45), 2.05, 0.1); put(s, impact(), 2.5, 0.26); put(s, whoosh(0.6), 2.3, 0.08)   # nasce l'anello
    for i in range(12): put(s, tick(900 + 70 * i), 2.7 + i * 0.09, 0.03)            # il grafico si colora
    put(s, ding(1046.5), 3.4, 0.12)
    put(s, impact(), 5.0, 0.12); put(s, shimmer(1568), 5.15, 0.07)                 # clienti di ritorno
    put(s, whoosh(0.7), 7.3, 0.08); put(s, impact(), 7.5, 0.12); put(s, pop(440), 7.65, 0.12)   # nuovi clienti
    put(s, whoosh(0.6), 9.7, 0.07); put(s, impact(), 10.0, 0.12)
    for b in range(6): put(s, pop(523.25 * 2 ** (b * 2 / 12)), 10.1 + b * 0.09, 0.09)   # barre
    put(s, ding(1318.5), 10.75, 0.13)
    put(s, riser(0.7), 12.15, 0.12); put(s, impact(), 12.85, 0.34); put(s, shimmer(1318.5), 12.9, 0.1)
    put(s, click(), 14.18, 0.2)
    return s
