import { getModelForClass, prop } from '@typegoose/typegoose';

class FeeEvent {
  @prop({ required: true })
  token!: string;

  @prop({ required: true })
  integrator!: string;

  @prop({ required: true })
  integratorFee!: string;

  @prop({ required: true })
  lifiFee!: string;
}

const FeeEventModel = getModelForClass(FeeEvent);
export default FeeEventModel;