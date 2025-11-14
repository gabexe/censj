#!/usr/bin/env python3
"""
Script para cifrar cartas.decrypted.json y actualizar cartas.json
Uso: python encrypt.py
"""
import json
import base64

KEY = "CON_ESO_NO_SE_JODE_2025"

def xor_cipher(data: bytes, key: str) -> bytes:
    """Aplica XOR cipher a los datos"""
    key_bytes = key.encode('utf-8')
    
    encrypted = bytearray()
    for i, byte in enumerate(data):
        encrypted.append(byte ^ key_bytes[i % len(key_bytes)])
    
    return bytes(encrypted)

def encrypt_file(input_file: str, output_file: str):
    """Cifra el archivo JSON"""
    print(f"Leyendo {input_file}...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Convertir a JSON string
    json_string = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    
    # Cifrar
    print("Cifrando datos...")
    encrypted_bytes = xor_cipher(json_string.encode('utf-8'), KEY)
    
    # Codificar en Base64
    encoded = base64.b64encode(encrypted_bytes).decode('utf-8')
    
    # Guardar
    print(f"Guardando en {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({"data": encoded}, f, indent=2)
    
    print(f"OK - Archivo cifrado exitosamente")
    print(f"  Tamaño original: {len(json_string)} bytes")
    print(f"  Tamaño cifrado: {len(encoded)} bytes")

if __name__ == "__main__":
    try:
        encrypt_file("cartas.decrypted.json", "cartas.json")
        print("\nOK - Completado")
        print("  cartas.json actualizado con contenido cifrado")
        print("\nAhora puedes:")
        print("  git add cartas.json")
        print("  git commit -m \"Update cards\"")
        print("  git push")
    except FileNotFoundError:
        print("ERROR: No se encontró cartas.decrypted.json")
        print("\nPrimero ejecuta: python decrypt.py")
    except Exception as e:
        print(f"ERROR: {e}")
