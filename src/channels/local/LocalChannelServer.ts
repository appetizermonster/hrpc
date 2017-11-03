import {
  IChannelSender,
  IChannelServer,
  ServerTopicHandler
} from '../../types';
import { ILocalChannelServer } from './types';

export default class LocalChannelServer
  implements IChannelServer, ILocalChannelServer {
  private channelName: string;
  private handlersByTopic: Map<string, ServerTopicHandler[]>;
  private isStarted: boolean;

  public constructor(channelName: string) {
    this.channelName = channelName;
    this.handlersByTopic = new Map();
    this.isStarted = false;
  }

  public async start(): Promise<void> {
    if (this.isStarted) throw new Error('Already started');
    this.isStarted = true;
  }

  public listen(topic: string, handler: ServerTopicHandler): void {
    let handlers = this.handlersByTopic.get(topic);
    if (!handlers) {
      handlers = [];
      this.handlersByTopic.set(topic, handlers);
    }
    handlers.push(handler);
  }

  public unlisten(topic: string, handler: ServerTopicHandler): void {
    const handlers = this.handlersByTopic.get(topic);
    if (!handlers) return;

    const idx = handlers.indexOf(handler);
    if (idx < 0) return;
    handlers.splice(idx, 1);
  }

  public emit(topic: string, sender: IChannelSender, payload: {}): void {
    const handlers = this.handlersByTopic.get(topic);
    if (!handlers) return;

    for (const handler of handlers) {
      handler(sender, payload);
    }
  }
}
