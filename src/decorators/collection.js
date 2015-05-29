import Collection from '../collection';

export default function CollectionDecorator(_Collection){
    return class _Collection extends Collection{};
}