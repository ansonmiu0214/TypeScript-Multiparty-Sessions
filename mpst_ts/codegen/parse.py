import pydot
import re

from .EFSM import Action, EFSM, EfsmBuilder, ReceiveAction, SendAction

def extract(token: str) -> str:
    """Extract label from transition."""
    return token[1:-1]

def from_file(path: str) -> EFSM:
    [graph] = pydot.graph_from_dot_file(path)
    return _parse_graph(graph)

def from_data(data: str) -> EFSM:
    [graph] = pydot.graph_from_dot_data(data)
    return _parse_graph(graph)

def _parse_graph(graph: pydot.Dot) -> EFSM:
    """Build EFSM representation from DOT graph."""
    nodes = [extract(node.get_name())
            for node in graph.get_nodes()]

    efsm = EfsmBuilder(nodes)
    for edge in graph.get_edge_list():
        # Parse transition
        src = extract(edge.get_source())
        dst = extract(edge.get_destination())
        label = extract(edge.get_label())

        # Add to EFSM
        action = Action.parse(label, dst)
        action.add_to_efsm(src, efsm)

    return efsm.build()