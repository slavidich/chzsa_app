import json

# Генерация данных для справочников
def generate_directories_data():
    data = []
    base_entities = {
        'TECHNIQUE_MODEL': 'Модель Техники',
        'ENGINE_MODEL': 'Модель Двигателя',
        'TRANSMISSION_MODEL': 'Модель Трансмиссии',
        'DRIVEN_AXLE_MODEL': 'Модель Ведущего Моста',
        'STEERED_AXLE_MODEL': 'Модель Управляемого Моста',
        'MAINTENANCE_TYPE': 'ТО',
        'FAILURE_NODE': 'Узел Отказа',
        'RECOVERY_METHOD': 'Способ Восстановления'
    }

    pk = 1
    for entity, base_name in base_entities.items():
        for i in range(1, 6):
            data.append({
                "model": "silant.directory",
                "pk": pk,
                "fields": {
                    "entity_name": entity,
                    "name": f"{base_name} - {i:03}",
                    "description": f"Описание для {base_name} - {i:03}"
                }
            })
            pk += 1

    with open('directories.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    generate_directories_data()