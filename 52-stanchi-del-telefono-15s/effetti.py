"""Effetti sonori dello spot 52 «Stanchi del telefono» (stile Motion): uno per ogni evento di sorgente/index.html.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.pop(784), 0.05, 0.08); put(s, a.tick(1400), 0.12, 0.05)                   # il cartello si appende (puntina)
    for k, t in enumerate([0.55, 1.25, 1.95]):                                          # il telefono squilla, il cartello trema
        put(s, a.buzz(), t, 0.1); put(s, a.ding(1318.5 + 80 * k), t, 0.04)
    put(s, a.buzz(), 2.3, 0.1)
    put(s, a.riser(0.5), 2.35, 0.1); put(s, a.whoosh(0.5), 2.45, 0.1)                   # la camera entra nel telefono
    put(s, a.impact(), 2.85, 0.14)
    for t in (2.9, 3.3): put(s, a.buzz(), t, 0.08)                                      # chiamata in arrivo
    put(s, a.tick(600), 3.78, 0.06)                                                     # chiamata persa
    for k, t in enumerate([4.0, 4.3, 4.6]):                                             # tre «Chiamata persa»
        put(s, a.pop(880 + 70 * k), t, 0.08); put(s, a.buzz(), t, 0.05)
    put(s, a.click(), 5.42, 0.2); put(s, a.ding(1046.5), 5.46, 0.08)                    # tocco su Beaflow
    put(s, a.riser(0.6), 5.5, 0.1); put(s, a.whoosh(0.6), 5.75, 0.08)                   # onda d'oro
    for k in range(6): put(s, a.tick(900 + 60 * k), 6.35 + 0.05 * k, 0.03)             # compaiono gli orari
    put(s, a.click(), 7.32, 0.18); put(s, a.pop(988), 7.34, 0.06)                       # sceglie le 10:30
    put(s, a.click(), 8.05, 0.2); put(s, a.ding(1318.5), 8.12, 0.08)                    # «Prenota» → «Prenotato ✓»
    put(s, a.whoosh(0.5), 8.75, 0.07)                                                   # la conferma sale
    put(s, a.whoosh(0.4), 9.5, 0.07); put(s, a.impact(), 9.86, 0.16)                    # cade nelle 10:30
    for k in range(4): put(s, a.tick(700 + 50 * k), 9.9 + 0.04 * k, 0.03)              # le righe sobbalzano
    put(s, a.ding(1568), 10.56, 0.12)                                                   # «Confermato»
    put(s, a.riser(0.5), 12.32, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 13.6, 0.2)                                                        # «Inizia gratis»
