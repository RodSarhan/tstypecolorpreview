# TS Type Color Preview

This extension allows previewing the colors of typescript string literals that correspond to color values

## Features

Hover on a variable with a color value as its type to see a preview of the possible colors

### Before

![type before 1](https://i.imgur.com/yFDN5GP.png)
![hover before 1](https://i.imgur.com/vxKtHWg.png)

![type before 2](https://i.imgur.com/Fz9Gb68.png)
![hover before 2](https://i.imgur.com/AW5c5pK.png)

### After

![hover after 1](https://i.imgur.com/cUfIzyW.png)
![hover after 2](https://i.imgur.com/xJDzoIc.png)

## Notes

This extension was inteded for my own uses and is essentially just a proof of concept for now, but I'm planning to support other color formats in the near future and enhance the caching behavior.

## Known Issues

- Currently only works with Hex values (#FFFFFF) (#FFF) (#FFFFFFAA).
- Types originating files other than the active one might be cached and not up to date with the latest changes.

## Release Notes

### 0.0.3

Better representation of treansparent colors

### 0.0.2

Performance enhancements

### 0.0.1

Initial experimental release

---

**Enjoy!**
