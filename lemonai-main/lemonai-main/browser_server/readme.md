the project use python environment

# install

```bash
cd /path/to/browserUse
```
you can use uv or pip or other to install 

## uv install：

recommend uv to manage python environment


create virtual environment

```
uv venv 
```

activate virtual environment

+ Linux/macOS：

```
source .venv/bin/activate
```

+ windows

```
.venv\Scripts\activate
```

install requirements

+ pyproject.toml：

```
uv pip install .
```

+ requirements.txt：

```
uv pip install -r requirements.txt
```

## Pip install：

acitavate virtual environment


```
pip install -r requirements.txt
```


## browser plugins install:

```bash
# before this step, you need to activate virtual environment
patchright install chromium --with-deps --no-shell
```



# launch

```bash
cd /path/to/browser_server
```

```bash
# activate virtual environment
```

```
python src/server.py
```



# tips:

the model must support tool calling and function calling, vision mode only supports gpt-4o
