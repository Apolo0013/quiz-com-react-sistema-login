lista = [3, 4, 6, 7, 8, 9, 10]
lenlista = len(lista) - 1
if len(lista) % 2 == 0:
    index = int(lenlista / 2)
    print(lista[index])
    print(lista[-index - 1])
else:
    print(lenlista / 2)
    print(lista[int(lenlista / 2)])