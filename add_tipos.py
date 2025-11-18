import json

# Cargar archivo descifrado
with open('cartas.decrypted.json', 'r', encoding='utf-8') as f:
    cartas = json.load(f)

# Palabras clave para detectar cartas grupales
palabras_grupales = [
    'todos', 'quien', 'quién', 'el que', 'la que', 'los que', 'las que',
    'mejor', 'peor', 'más', 'menos', 'entregue esta carta', 'debe debatir',
    'participantes', 'grupo', 'equipos', 'parejas', 'entre todos'
]

# Cartas especiales (por título)
cartas_especiales = [
    'CARTA PALA',  # Roba cartas a otros
    'CARTA BULLYING'  # Acción especial
]

# Procesar cada carta
for carta in cartas:
    titulo = carta['titulo']
    texto_completo = titulo.lower()
    
    # Agregar contenido si existe
    if 'descripcion' in carta and carta['descripcion']:
        texto_completo += ' ' + carta['descripcion'].lower()
    if 'contenido' in carta and isinstance(carta['contenido'], list):
        texto_completo += ' ' + ' '.join(carta['contenido']).lower()
    
    # Determinar tipo
    if titulo in cartas_especiales:
        carta['tipo'] = 'especial'
    elif any(palabra in texto_completo for palabra in palabras_grupales):
        carta['tipo'] = 'grupal'
    else:
        carta['tipo'] = 'individual'
    
    print(f"{titulo}: {carta['tipo']}")

# Guardar archivo actualizado
with open('cartas.decrypted.json', 'w', encoding='utf-8') as f:
    json.dump(cartas, f, ensure_ascii=False, indent=2)

print("\n✓ Archivo actualizado con campo 'tipo'")
print("Ahora ejecuta: python encrypt.py")
