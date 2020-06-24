import jinja2

class TemplateGenerator:

    def __init__(self, *, dirname):
        self.template_loader = jinja2.FileSystemLoader(searchpath=dirname)

    def render(self, *, path, payload, filters=None):
        """Render template file and commit to file system."""
        
        template_env = jinja2.Environment(loader=self.template_loader)
        if filters is not None:
            template_env.filters.update(filters)
        
        template = template_env.get_template(path)
        return template.render(payload)