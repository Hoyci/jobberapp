import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@hoyci/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;

  while (!isConnected) {
    log.info('AuthService connecting to ElasticSearch...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`AuthService ElasticSearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticserach failed. Retrying...');
      log.log('error', 'AuthService checkConnection() method:', error);
    }
  }
}
