import { getModelForClass, prop } from "@typegoose/typegoose";

class Block {
  @prop({ required: true, unique: true })
  number!: number;

  @prop({ required: true, default: 0 })
  eventCount!: number;
}

const BlockModel = getModelForClass(Block);
export { BlockModel };