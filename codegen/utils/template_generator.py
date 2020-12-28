import jinja2
import typing

class TemplateGenerator:

    def __init__(self, *, dirname: str):
        self.template_loader = jinja2.FileSystemLoader(searchpath=dirname)

    def render(self, *,
               path: str,
               payload: typing.Dict,
               filters: typing.Optional[typing.Dict] = None) -> str:
        """Render template file and commit to file system."""
        
        template_env = jinja2.Environment(loader=self.template_loader)
        if filters is not None:
            template_env.filters.update(filters)
        
        template = template_env.get_template(path)
        return template.render(payload)