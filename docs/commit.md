# Convención de Commits

## Formato

```
<tipo>: <descripción breve>

<cuerpo opcional>
```

## Tipos

| Tipo       | Cuándo usarlo                                                  |
|------------|----------------------------------------------------------------|
| `feat`     | Al añadir una nueva funcionalidad (feature).                   |
| `fix`      | Al solucionar un error o bug.                                  |
| `docs`     | Cambios exclusivos en la documentación (README, manuales).     |
| `style`    | Cambios de formato (espacios, indentación) sin efecto en código.|
| `refactor` | Reestructuración sin corregir errores ni añadir funcionalidad. |
| `perf`     | Cambio enfocado en mejorar el rendimiento.                     |
| `test`     | Añadir pruebas unitarias faltantes o corregir existentes.      |
| `chore`    | Mantenimiento, dependencias, herramientas de compilación.      |

## Ejemplos

```
feat: agregar formulario de contacto con validación
fix: corregir error de compilación de i18n con el carácter @
docs: actualizar README con instrucciones de instalación
style: formatear archivos con prettier
refactor: extraer lógica de validación a un composable
perf: lazy loading de imágenes en la sección de proyectos
test: agregar tests unitarios para el store de proyectos
chore: actualizar vue-i18n a v11
```
