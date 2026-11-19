"""Effetti sonori dello spot 20 «Dal link in bio»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py (a.put, a.tick, a.impact, …)."""


def effetti(s, a):
    put = a.put
    for i in range(8): put(s, a.pop(700 + 60 * (i % 4)), 0.1 + i * 0.11, 0.04)          # fumetti-messaggio che arrivano
    put(s, a.whoosh(0.8), 0.95, 0.07); put(s, a.shimmer(1318.5), 1.6, 0.06)            # si avvolgono nell'anello-link
    put(s, a.pop(880), 1.0, 0.08)                                                      # scheda del profilo
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.6), 2.4, 0.12)   # volo dentro l'anello
    put(s, a.click(), 3.3, 0.1); put(s, a.whoosh(0.5), 3.3, 0.06)                     # si apre la pagina
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)                    # servizi
    for k in range(3): put(s, a.pop(784 + 100 * k), 5.2 + k * 0.12, 0.07)
    put(s, a.click(), 5.9, 0.14); put(s, a.ding(1046.5), 6.0, 0.1)                    # servizio scelto
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)                    # orari
    for i in range(8): put(s, a.tick(1000 + 60 * i), 7.55 + i * 0.05, 0.03)
    put(s, a.click(), 8.0, 0.14); put(s, a.pop(988), 8.25, 0.1)                       # orario scelto
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.ding(1318.5), 10.55, 0.13)                                                # Confermata
    for k in range(6): put(s, a.pop(600 - 40 * k), 10.75 + k * 0.08, 0.03)            # i fumetti spariscono
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
