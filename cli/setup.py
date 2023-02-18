from setuptools import setup

setup(
	name='intelliQ-CLI',
	version='1.0',
	py_modules=['cli'],
	install_requires=['click','requests','pandas','tabulate', 'pytest'],
	entry_points={
		'console_scripts': [
			'se2226=cli:main'
		]
	}
)