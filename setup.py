try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages

setup(name='midi-piano',
      version='1.0',
      description='Simple MIDI Piano',
      author='Jessica Graham',
      author_email='jjgraham4@gmail.com',
      url='',
      packages=find_packages(),
      install_requires=[
        "Flask>=0.10.1"
      ]
)
