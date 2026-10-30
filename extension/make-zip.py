# Builds Extension.zip at the top of the repository: the files of this folder inside a folder named Extension, so the
# download unzips to "Extension". Run it after every change to the extension: python3 extension/make-zip.py
import os, zipfile
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, "..", "Extension.zip")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for folder, _, files in sorted(os.walk(here)):
        for name in sorted(files):
            if name == "make-zip.py" or name.startswith("."):
                continue
            path = os.path.join(folder, name)
            info = zipfile.ZipInfo("Extension/" + os.path.relpath(path, here).replace(os.sep, "/"), (2024, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            with open(path, "rb") as f:
                z.writestr(info, f.read())
