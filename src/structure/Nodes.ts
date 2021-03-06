/*
Declaration of handy string literal types
*/
// Declare a node "type" string literal
export type NodeType = "UnpairedNode" | "StemNode" | "TerminalLoopNode" | "BulgeNode" | "InternalLoopNode" | "MultiLoopNode";

/*
Declaration of a Node class, and inheriting node classes for the different type of tree nodes (sequence features)
*/
export class Node {
    /*
    All Nodes have attributes parent (single node), daughters (left to right array of nodes),
    and sequence indices (which characters in the sequence are owned by this node)
    */
    public parent: Node;
    public daughters: Array<Node> = [];
    public type: string;
    public stringIndices: Array<number>

    constructor(parent: Node) {
        this.parent = parent;
    }

    public pushDaughters(daughter: Node) {
        this.daughters.push(daughter);
    }

}

export class UnpairedNode extends Node {
    /*
    Unpaired Nodes are just an unpaired sequence
    */
    public sequence: string;
    public type: NodeType = 'UnpairedNode';

    constructor(parent: Node, sequence: string, sequenceIndices: Array<number>) {
        super(parent)
        this.sequence = sequence
        this.sequenceIndices = sequenceIndices
    }
}

export class StemNode extends Node {
    /*
    Stem Nodes encode an uninterrupted double-stranded region
    */
    public pairs: Array<number>;
    public type: NodeType = 'StemNode';

    constructor(parent: Node, pairs: Array<string>, sequenceIndices: Array<number>) {
        super(parent);
        this.pairs = pairs;
        this.sequenceIndices = sequenceIndices
    }
}

// Similar to how we draw, all circular nodes are pretty much the same structurally
export class CircularNode extends Node {
    public type: NodeType

    constructor(parent: Node) {
        super(parent)
    }
}

export class TerminalLoopNode extends Node {
    /*
    TerminalLoop Nodes are the end of the line
    */
    public type: NodeType = 'TerminalLoopNode';

    constructor(parent: Node) {
        super(parent);
    }
}

export class BulgeNode extends CircularNode {
    /*
    
    */
    public type: NodeType = 'BulgeNode';

    constructor(parent: Node) {
        super(parent)
    }
}

export class InternalLoopNode extends Node {
    /*
    Internal loop are like BulgeNodes but have "left" AND "right" sequence that lead to a single stem
    */
    public type: NodeType = 'InternalLoopNode';


    constructor(parent: Node) {
        super(parent);
    }
}

export class MultiLoopNode extends Node {
    /*
    Multi loops are complex internal loops that have both unpaired regions and stems
    */
    public type: NodeType = 'MultiLoopNode';

    constructor(parent: Node) {
        super(parent)
    }

}

export class RootNode extends Node {
    // This is a special node that just holds the top
    public type: NodeType = 'RootNode';

    constructor() {
        super(null, null);
    }
}
