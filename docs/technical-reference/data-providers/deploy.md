---
sidebar_position: 2
sidebar_label: "Deploy"
---

# Deploy

In this section, you will see how to run a RedStone node using Docker Compose.

:::caution
For production deployments consider using more sophisticated tools, e.g. Kubernetes.
:::

### Requirements

- Reliable Internet connection
- 2CPU, 2GB RAM
- At least 30 GB of storage (mainly for logs)
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

:::tip
The hardware requirements for running a RedStone node are quite low, but you should reserve a healthy margin. The more resources you spare when provisioning your machine, the better it will perform and the less likely it will be to run into issues.
:::

### Docker Compose Example

Here's a simple example of a `docker-compose.yml` file that you can use to run the RedStone oracle node locally. Copy this configuration and adjust it to your needs.

```yaml
services:
  redstone-oracle-node:
    image: public.ecr.aws/y7v2w8b2/redstone-oracle-node@sha256:07eb1cc4aa3a4f0275c2ef5c2f9a95af06150e35211e20f66f9b24ab1c05cef7
    restart: always
    depends_on:
      - redstone-kms
    networks:
      - public_network
      - private_network
    volumes:
      - redstone-oracle-node:/oracle-node-level-db
    environment:
      OVERRIDE_DIRECT_CACHE_SERVICE_URLS: '["https://httpbin.org/anything"]'
      OVERRIDE_MANIFEST_USING_FILE: ./manifests/dev/dev.json
      PRICE_CACHE_LOCATION: /oracle-node-level-db
      REMOTE_SIGNER_URL: http://redstone-kms:4499
      ENABLE_REMOTE_SIGNER: true

  redstone-kms:
    restart: always
    image: public.ecr.aws/y7v2w8b2/kms@sha256:d069bc9afcd1b4e6884e2d4e530d90c94db0aaf1a2265d7facb4f4e2d2fefb3d
    networks:
      - private_network
    expose:
      - "4499"
    environment:
      KMS_PRIVATE_KEY_FILE: /run/secrets/private_key
    secrets:
      - private_key

secrets:
  private_key:
    file: private_key.txt

volumes:
  redstone-oracle-node:

networks:
  public_network:
    driver: bridge
  private_network:
    internal: true # This ensures the network is private
```

### Services

#### RedsStone KMS (Key Management Service)

RedStone KMS' sole purpose is to handle all operations on your private key. It signs the data fetched by the oracle node and returns the evm address. This should be the only service that has access to your private key. Use the [RedStone KMS](https://gallery.ecr.aws/y7v2w8b2/kms) Docker image.

| Param                    | Description                                                                                          | Example value                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **KMS_PRIVATE_KEY_FILE** | Path to the file with your private key. The file should contain a single line with your private key. | `KMS_PRIVATE_KEY_FILE=/run/secrets/private_key` |
| **KMS_PRIVATE_KEY**      | Hex encoded key. Alternative way of passing the key                                                  | `KMS_PRIVATE_KEY=0xYOUR_PRIVATE_KEY`            |
| **KMS_ADDRESS**          | Bind address                                                                                         | `KMS_ADDRESS=0.0.0.0:4499`                      |

#### RedStone Node

RedStone oracle node will fetch data from main public APIs, sign them with your private keys and broadcast to the RedStone Data Distribution Layer (DDL).
It should be configured using environment variables.

| Param                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          | Example value                                                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **ENABLE_REMOTE_SIGNER**               | Delegate signing to a remote signer. Only this image has access to your ECDSA private key                                                                                                                                                                                                                                                                                                                                                            | `ENABLE_REMOTE_SIGNER=true`                                                                                  |
| REMOTE_SIGNER_URL                      | This is where Redstone's signer is listening. We recommend using a colocation e.g. in Kubernetes oracle-node and signer should be run in the same POD. By default `http://localhost:4499`.key                                                                                                                                                                                                                                                        | `REMOTE_SIGNER_URL=http://localhost:4499`                                                                    |
| **OVERRIDE_DIRECT_CACHE_SERVICE_URLS** | Your personal private URLs of gateways to the RedStone Data Distribution Layer (DDL). For running a local node you can simply put `OVERRIDE_DIRECT_CACHE_SERVICE_URLS=["https://httpbin.org/anything"]`. But for production node running you should [request them](https://redstone.finance/discord) from the RedStone team.                                                                                                                         | `OVERRIDE_DIRECT_CACHE_SERVICE_URLS=["https://xxx.yyy.secret-url-1.com","https://zzz.aaa.secret-url-2.com"]` |
| **OVERRIDE_MANIFEST_USING_FILE**       | Path to your manifest file. Manifest is a public JSON file that defines the provider's obligation regarding the data that they provide. It sets fetching interval, tokens, sources and other public technical details for the provided data. You can check available manifests [here.](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/oracle-node/manifests)                                                       | `OVERRIDE_MANIFEST_USING_FILE=./manifests/dev/dev.json`                                                      |
| **PRICE_CACHE_LOCATION**               | Path to the local price cache. Each RedStone oracle node relies on a simple file-based prices cache. It is used to store recently fetched values from the last 15 minutes. These values are used for checking value deviations, filtering outliers and preventing price manipulation attacks. <br/><br/> You don't need to create a Level DB instance manually, it will be created automatically at the specified path during the first node launch. | `PRICE_CACHE_LOCATION=/oracle-node-level-db`                                                                 |
| **ENABLE_REMOTE_SIGNER**               | Switch on signing with RedStone KMS                                                                                                                                                                                                                                                                                                                                                                                                                  | `ENABLE_REMOTE_SIGNER=true`                                                                                  |

:::tip Custom local manifest
If you want to run oracle-node from Docker with your custom manifest you should [mount the manifest file](https://docs.docker.com/storage/bind-mounts/) from your local system to the docker container and update the `OVERRIDE_MANIFEST_USING_FILE` env variable.
:::
