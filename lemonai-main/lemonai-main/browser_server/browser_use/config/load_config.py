from pathlib import Path
import yaml
import os

config_path = Path(__file__).parent / 'config.yaml'

def read_yaml_file(config_path = config_path):
    try:
        with open(config_path, 'r') as file:
            return yaml.safe_load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"File is not exist: {config_path}")
    except yaml.YAMLError as e:
        raise yaml.YAMLError(f"File parser error: {e}")


config = read_yaml_file()

if __name__ == '__main__':
    print(config)
    print(type(config['agent']['max_steps']))
    print(config['browser']['user-agent'])
