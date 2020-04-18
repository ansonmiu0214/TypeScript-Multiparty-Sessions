import pydot
import re

from .efsm import Action, EFSM, EfsmBuilder, ReceiveAction, SendAction

def extract(token: str) -> str:
    return token[1:-1]

def from_file(path: str, **metadata) -> EFSM:
    [graph] = pydot.graph_from_dot_file(path)
    return _parse_graph(graph, metadata)

def from_data(data: str, **metadata) -> EFSM:
    [graph] = pydot.graph_from_dot_data(data)
    return _parse_graph(graph, metadata)

def _parse_graph(graph: pydot.Dot, metadata) -> EFSM:
    nodes = [extract(node.get_name())
            for node in graph.get_nodes()]

    efsm = EfsmBuilder(nodes, metadata)
    for edge in graph.get_edge_list():
        src = extract(edge.get_source())
        dst = extract(edge.get_destination())
        label = extract(edge.get_label())

        action = Action.parse(label, dst)
        action.add_to_efsm(src, efsm)

    return efsm.build()