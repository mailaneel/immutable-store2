import CollectionClass from './collection';

export default function Collection(_CollectionClass){
    return class _CollectionClass extends CollectionClass{};
}