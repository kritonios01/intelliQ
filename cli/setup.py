from setuptools import setup

setup(
	name='intelliQ_CLI_Tools',
	version='1.0',
	py_modules=['cli'],
	install_requires=['Click','requests','pandas','tabulate'],
	entry_points={
		'console_scripts': [
			'se2226=cli:main'
		]
	}
)