import { ParsedFeeCollectedEvents } from './dto';

interface EventProcessingStrategy {
  processEvent(event: ParsedFeeCollectedEvents): void;
}

class DefaultEventProcessingStrategy implements EventProcessingStrategy {
  processEvent(event: ParsedFeeCollectedEvents): void {
    console.log('Processing event:', event);
    // Add default processing logic here
  }
}

class SpecialEventProcessingStrategy implements EventProcessingStrategy {
  processEvent(event: ParsedFeeCollectedEvents): void {
    console.log('Processing special event:', event);
    // Add special processing logic here
  }
}

export { EventProcessingStrategy, DefaultEventProcessingStrategy, SpecialEventProcessingStrategy };
