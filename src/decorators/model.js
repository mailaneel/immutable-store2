import Model from '../model';

export default function ModelDecorator(_Model){
    return class _Model extends Model{};
}