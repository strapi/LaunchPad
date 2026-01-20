
### Backend Configuration File

The backend configuration file is located at the root of the project.envFile. You can refer.env.exampleFile to learn about the available configuration items and their examples.

#### Configuration Item Description

* **STORAGE\_PATH**
  * Description: Defines where SQLite database files are stored.
  * Default:data/database.sqlite
  * Example:

STORAGE\_PATH=data/database.sqlite\


*
  * Note: If not configured, the system will use the defaultdata/database.sqliteAs the storage path for the database file.
* **WORKSPACE\_DIR**
  * Description: Defines the mapping path of the workspace on the local host.
  * Example:

WORKSPACE\_DIR=workspace\


* **RUNTIME\_TYPE**
  * Description: Defines how to start the backend service.
  * Default:docker(Sandbox Environment required)
  * Optional values:
    * docker: The default value, which means running in the Docker sandbox environment.
    * local: For developers to use when debugging locally.
  * Example:

RUNTIME\_TYPE=docker\
