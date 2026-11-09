

Your current repository is `~/Downloads/UPS_ServiceNow_ITOM_Transformation` and contains your documentation. The code ZIP adds a **new** `servicenow-implementation/` directory. Do not run `git init` or clone again.

```bash
cd ~/Downloads/UPS_ServiceNow_ITOM_Transformation
mkdir -p ~/Downloads/ITOM-Code-Extracted
unzip -o ~/Downloads/UPS-ITOM-Implementation-Code.zip -d ~/Downloads/ITOM-Code-Extracted
cp -r ~/Downloads/ITOM-Code-Extracted/servicenow-implementation .
ls servicenow-implementation
cd servicenow-implementation
node --test tests/*.test.js
cd ..
git status
# Review your scripts and existing files for confidential or unauthorized content

git add servicenow-implementation/
git commit -m "Add ServiceNow ITOM reference implementation and tests"
git push -u origin main
```

Note: Code does not automatically deploy to ServiceNow when pushed to GitHub.
