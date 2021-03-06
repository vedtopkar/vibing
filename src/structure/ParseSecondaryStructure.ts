import { DefaultConfig, DrawConfig } from "../config/DrawConfig"
import { RootNode, Node, UnpairedNode, StemNode, BulgeNode, TerminalLoopNode, InternalLoopNode, MultiLoopNode } from "./Nodes"

export class StructureTree {
    // A class that holds the root of a tree (that's it for now!)
    public root: Node = new RootNode()

}

export class ParseSecondaryStructure {
    public name: string
    public sequence: string
    public sequence_indices: Array<number>
    public db: string
    public pairs: Array<number>
    public structureTree: StructureTree
    public drawConfig: DrawConfig = DefaultConfig

    constructor(name: string, sequence: string, db: string) {
        this.name = name
        this.sequence = sequence
        this.sequence_indices = Array.from(Array(this.sequence.length).keys())
        this.db = db

        this.pairs = this.db_to_pairs(this.db)
        this.structureTree = this.pairs_to_tree(this.pairs)

    }
    
    private db_to_pairs(db: string): Array<number> {
        /*
        Given a dot-bracket secondary structure, convert into an array where the ith position encodes
        the index of the corresponding base-paired position. Unpaired positions are null.
        
        Uses a heap approach. Push values when we see '('s, pop values whenever we see ')'s
        */
        let cursor: number = 0;
        let pairs: Array<number> = Array.apply(null, Array(db.length)).map(function () {})
        let left_helix_positions: Array<number> = []

        while (cursor <= db.length) {
            if (db.charAt(cursor) == '.') {
                pairs[cursor] = null
            } else if (db.charAt(cursor) == '(') {
                left_helix_positions.push(cursor)
            } else if (db.charAt(cursor) == ')') {
                let left_helix_position: number = left_helix_positions.pop()
                pairs[cursor] = left_helix_position
                pairs[left_helix_position] = cursor
            }
            cursor += 1
        }

        return pairs
    }

    private pairs_to_tree() {
        /*
        Convert the pairs array from db_to_pairs into a proper tree representation

        Here we initialize our root node and tree. Then we kick off a "dispatch" function that scans through
        the structure and kicks off recursive tree builds as we encounter different structure elements.
        */

        let tree: StructureTree = new StructureTree()
        let root: RootNode = new RootNode()

        tree.root = root

        let left: number = 0
        let right: number = this.pairs.length

        // Execute our recursive tree building, using our new root node as root
        this.recursive_tree_dispatch(left, right, root)
        
        return tree
    }

    private find_end_of_unpaired(start_index: number, reverse: boolean = false) {
        /*
        This is a helper function that scans through an unpaired region and returns the index of the
        first non-unpaired nucleotide. Can be run in forward or reverse (forward is default).
        */
        let cursor: number = start_index
        let increment: number = 1

        if (reverse) {
            increment = -1
        }

        while (this.pairs[cursor + increment] == null) {
            cursor += increment
        }

        return cursor

    }

    private recursive_tree_dispatch(left: number, right: number, parentNode: Node) {
        /*
        This is where we scan a complex region (either root or an internal loop) and spawn recursive tree builds
        */
        let left_cursor: number = left
        let right_cursor: number = left

        while (right_cursor <= right) {
            if (this.pairs[right_cursor] == null) {
                // Make an unstructured node
                while (this.pairs[right_cursor + 1] == null && right_cursor <= right) {
                    right_cursor += 1
                }

                let u: UnpairedNode = new UnpairedNode(parentNode, this.sequence.slice(left_cursor, right_cursor + 1), this.sequence_indices.slice(left_cursor, right_cursor + 1))
                parentNode.pushDaughters(u)
                left_cursor = right_cursor = right_cursor + 1
            } else {
                // Kick off recursive tree build for a stem
                this.recursive_tree_build(left_cursor, this.pairs[left_cursor], parentNode)
                left_cursor = right_cursor = this.pairs[left_cursor] + 1
            }
        }

    }

    private recursive_tree_build(left: number, right: number, parentNode: Node) {
        /*
        Here, we  traverse the secondary structure to recursively build up the structure tree
        */

        let cursor: number = left

        // Calculate if 0, 1, or 2 of the nucleotides at the left and right boundaries are paired
        let n_boundary_paired: number = [this.pairs[left], this.pairs[right]].filter(Boolean).length

        if (n_boundary_paired == 2 && this.pairs[left] == right && this.pairs[right] == left) {
            // We are at a stem!
            let stem_indices: Array<number> = []
            let stem_pairs: Array<Array<string>> = []

            let left_cursor: number = left
            let right_cursor: number = right

            // Consume the stem and make its node
            while (this.pairs[left_cursor] != null && this.pairs[right_cursor] != null && this.pairs[left_cursor] == right_cursor && this.pairs[right_cursor] == left_cursor) {
                stem_indices.push([left_cursor, right_cursor])

                stem_pairs.push([this.sequence.charAt(left_cursor), this.sequence.charAt(right_cursor)])

                left_cursor += 1
                right_cursor -= 1
            }

            // Make the node, add it to the parent
            let s: StemNode = new StemNode(parentNode, stem_pairs, stem_indices)
            parentNode.pushDaughters(s)

            // Kick off the next recursive layer, with the stem we just made as parent
            this.recursive_tree_build(left_cursor, right_cursor, s)

        } else if (n_boundary_paired == 1 && (this.find_end_of_unpaired(left) + 1 == this.pairs[right] || this.find_end_of_unpaired(right, true) - 1 == this.pairs[left])) {
            // We are at a bulge!
            let sequence: string
            let left_cursor: number = left
            let right_cursor: number = right

            let b: BulgeNode = new BulgeNode(parentNode)
            
            // Depending on which side the bulge is on, arrange the stem and unpaired nodes in one order or the other
            // There is probably a much simpler way to do this...
            if(this.pairs[left] == null) {
                // left side bulge
                left_cursor = this.find_end_of_unpaired(left)
                sequence = this.sequence.slice(left, left_cursor + 1)
                left_cursor += 1

                let u: UnpairedNode = new UnpairedNode(b, sequence, this.sequence_indices.slice(left, left_cursor + 1))
                b.pushDaughters(u)
                this.recursive_tree_build(left_cursor, right_cursor, b)

            } else {
                // right side bulge
                right_cursor = this.find_end_of_unpaired(right, true)
                sequence = this.sequence.slice(right_cursor, right + 1)

                let u: UnpairedNode = new UnpairedNode(b, sequence, this.sequence_indices.slice(right_cursor, right + 1))

                console.log('BULGE', right_cursor, right)
                this.recursive_tree_build(left_cursor, right_cursor - 1, b)
                b.pushDaughters(u)
            }

            parentNode.pushDaughters(b)


        } else if (n_boundary_paired == 0 && this.find_end_of_unpaired(left) == right) {
            // We are at a terminal loop!
            let t: TerminalLoopNode = new TerminalLoopNode(parentNode)
            let u: UnpairedNode = new UnpairedNode(t, this.sequence.slice(left, right + 1), this.sequence_indices.slice(left, right + 1))

            t.pushDaughters(u)
            parentNode.pushDaughters(t)
            // End of the line!

        } else {
            // We are in an internal/multi loop
            let left_cursor = this.find_end_of_unpaired(left)
            let right_cursor = this.find_end_of_unpaired(right, true)

            let m: MultiLoopNode = new MultiLoopNode(parentNode)
            parentNode.pushDaughters(m)
            this.recursive_tree_dispatch(left, right, m)

        }
    }
}