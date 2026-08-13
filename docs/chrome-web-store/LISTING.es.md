# Texto del listing de Chrome Web Store (Español)

> Pegar en [Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Store listing (locale Español).  
> La descripción corta del manifesto está en `_locales/es/messages.json` (`extensionDescription`).

**Código abierto:** [https://github.com/webLiang/header-modify-extention](https://github.com/webLiang/header-modify-extention)

---

## Nombre

```
Header Modify
```

## Descripción corta (≤132 caracteres)

```
Herramienta open-source para editar encabezados HTTP por sitio, incluidos iframes. Pega desde Chrome DevTools.
```

## Descripción detallada

```
Header Modify es una extensión open-source de Chrome que reescribe los encabezados de solicitud HTTP en los sitios que actives.

CÓDIGO ABIERTO
Totalmente open source en GitHub: lee el código, audita permisos, abre issues y contribuye:
https://github.com/webLiang/header-modify-extention
Sin ofuscación, sin código remoto, sin anuncios. Lo que instalas coincide con el repositorio público.

PROPÓSITO ÚNICO
Esta extensión hace una sola cosa: en los orígenes que actives, aplica tus encabezados a las peticiones de esa pestaña (incluidos iframes) con declarativeNetRequest modifyHeaders y operación set (añadir si falta, reemplazar si existe).

PARA QUIÉN
• Desarrolladores front-end que depuran auth, CORS, idioma o CDN
• QA que necesita reproducir condiciones de encabezados del cliente
• Usuarios avanzados que necesitan overrides temporales de User-Agent u otros encabezados

CÓMO USAR
1. Tras instalar, la reescritura está OFF en todos los sitios.
2. Abre una página http(s), haz clic en el icono y pega encabezados de Chrome DevTools (o añádelos a mano).
3. Activa “Activar en este sitio”. Recarga e inspecciona Network.
4. Las peticiones de iframes de origen cruzado en la misma pestaña también se incluyen (reglas de sesión con tabIds).

PERMISOS
• storage — guardar encabezados, orígenes activos e idioma en local (nunca se suben)
• tabs — leer la URL/origen de la pestaña activa para sincronizar reglas
• declarativeNetRequest — aplicar modificaciones de encabezados
• declarativeNetRequestFeedback — diagnóstico opcional de reglas
• acceso a hosts (<all_urls>) — necesario para modificar encabezados en sitios arbitrarios e iframes

PRIVACIDAD
No se recopilan ni envían datos personales, historial ni contenido de página. Los ajustes permanecen en chrome.storage.local. Consulta la Política de privacidad del listing.

NO PARA
Eludir paywalls, DRM, accesos de cuenta ni usos ilegales. Solo reescribe los encabezados que configures para depuración y pruebas legítimas.

CÓDIGO Y SOPORTE
GitHub: https://github.com/webLiang/header-modify-extention
Issues: https://github.com/webLiang/header-modify-extention/issues
```

## Categoría

```
Developer Tools
```

## URL oficial / Soporte / Privacidad

```
https://github.com/webLiang/header-modify-extention
https://github.com/webLiang/header-modify-extention/issues
https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.md
```
