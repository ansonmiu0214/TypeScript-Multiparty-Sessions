import dotpruner
import pydot

from codegen.automata.efsm import EFSM

def from_file(path: str) -> EFSM:
    """Parse EFSM reprsentation from the file in specified 'path'."""

    graph = dotpruner.process_from_file(path)
    return _parse_graph(graph)


def from_data(data: str) -> EFSM:
    """Parse EFSM reprsentation from the specified string 'data'."""

    graph = dotpruner.process_from_string(data)
    return _parse_graph(graph)


def _extract(token: str) -> str:
    """Extract value from specified 'token'."""

    return token[1:-1]


def _parse_graph(graph: pydot.Graph) -> EFSM:
    """Build internal EFSM representation from specified DOT 'graph'."""

    from .actions import Action
    from .efsm import EfsmBuilder

    nodes = [_extract(node.get_name()) for node in graph.get_nodes()]

    efsm = EfsmBuilder(nodes)
    for edge in graph.get_edge_list():

        src = _extract(edge.get_source())
        dst = _extract(edge.get_destination())
        label = _extract(edge.get_label())

        action = Action.parse(label, src, dst)
        action.add_to_efsm(efsm)
    
    return efsm.build()